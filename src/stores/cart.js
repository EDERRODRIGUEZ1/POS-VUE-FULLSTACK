import { ref, computed, watch, watchEffect } from 'vue'
import { defineStore } from 'pinia';
import { collection, addDoc} from 'firebase/firestore';
import { useFirestore } from 'vuefire';
import { useCouponStore } from './coupons';
import { getCurrentDate } from '../helpers'
import { data } from 'autoprefixer';

export const useCartStore = defineStore('cart', () => {

    const coupon = useCouponStore()
    const db = useFirestore()
    const items = ref([])
    const subtotal = ref(0)
    const taxes = ref(0) //state de impuesto
    const total = ref(0)

    const MAX_PRODUCTS = 5
    const TAX_RATE = .10  //IMPUESTO

    // watch(items, () => {
    //     //el cero es le valor inicial
    //     subtotal.value = items.value.reduce((total , item) => total + (item.quantity * item.price), 0)
    //     //calcular el impuesto
    //     taxes.value = subtotal.value * TAX_RATE
    //     //total
    //     total.value = subtotal.value + taxes.value
    // }, {
    //     deep: true
    // })

    watchEffect(() =>{
        //el cero es le valor inicial
        subtotal.value = items.value.reduce((total , item) => total + (item.quantity * item.price), 0)
        //calcular el impuesto
        taxes.value = Number((subtotal.value * TAX_RATE).toFixed(2))
        //total
        total.value = (subtotal.value + taxes.value) - coupon.discount
    })

    function addItem(item) {
        const index = isItemInCart(item.id)
        if(index >= 0) {
            if(isProductAvailable( item, index)) {
                alert('Has alcanzado el limite')
                return
            }
            // Si existe se DEBE ACTUALIZAR LA CANTIDAD
            items.value[index].quantity++
        }else{
            items.value.push({...item, quantity: 1, id: item.id})
        }
    }

    function updateQuantity(id, quantity) {
        items.value = items.value.map( item => item.id === id ? {...item, quantity} : item)
    }

    function removeItem(id) {
        items.value = items.value.filter( item => item.id !== id)
    }

    //VENTAS
    async function checkout() {
        try {
            await addDoc(collection(db, 'sales'), {
                
                items: items.value.map( item => {
                    const { availability, category, ...data } = item;
                    return data
                }),
                subtotal: subtotal.value,
                taxes: taxes.value,
                discount: coupon.discount,
                total: total.value,
                date: getCurrentDate()
            })
        } catch (error) {
            console.log(error);
        }
    }

    //se encarga de comprobar si el elemento ya existe en el carrito
    const isItemInCart = id => items.value.findIndex( item => item.id === id) //findIndex regresa la posicion del elemento del arreglo
    
    //se encarga de comprobar si hay disponibles
    const isProductAvailable = ( item, index) =>{
        return items.value[index].quantity >= item.availability || items.value[index].quantity >= MAX_PRODUCTS
    }

    const isEmpty = computed(() => items.value.length === 0);

    const checkProductAvailability = computed(() => {
        return (product) => product.availability < MAX_PRODUCTS ? product.availability : MAX_PRODUCTS
    })
    return {
        items,
        subtotal,
        taxes,
        total,
        addItem,
        updateQuantity,
        removeItem,
        checkout,
        isEmpty,
        checkProductAvailability,
       
    }
});