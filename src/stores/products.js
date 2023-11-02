import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useFirestore, useCollection, useFirebaseStorage } from 'vuefire'; //permite que mi app de vue se conecte con firestore
import { collection, addDoc, where, query, limit, orderBy, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';

export const useProductsStore = defineStore('products', ()=> {

    const db = useFirestore();
    const storage = useFirebaseStorage()

    const selectedCategory = ref(1)
    const category = [
        {id: 1, name: 'Sudaderas'},
        {id: 2, name: 'Tenis'},
        {id: 3, name: 'Lentes'},
    ]

    const q = query(
        collection(db, 'products'),
        // where('availability', '>=', 1),
        orderBy('availability', 'asc')
    )

    const productsCollection = useCollection(q)

    async function createProduct(product) {
        await addDoc(collection(db, 'products'), product)
    }

    async function updateProduct(docRef, product) {
        console.log(product);
        const { image, url, ...values } = product;

        if(image.length ) {
            //UPDATE
            //cuando hay una imagen nueva
            await updateDoc(docRef, {
                ...values, 
                image: url.value

            })

        }else{
            //UPDATE
            //cuando no hay una imagen nueva
            await updateDoc(docRef, values)
        }
    }

    async function deleteProduct(id) {
        if(confirm('Eliminar Producto?')) {
            const docRef = doc(db, 'products', id)
            const docSnap = await getDoc(docRef)
            const {image} = docSnap.data()
            const imageRef = storageRef(storage, image)

            //las dos funciones se ejecuten al mismo tiempo
            await Promise.all([
                deleteDoc(docRef),
                deleteObject(imageRef)
            ])
           
        }
    }

    const categoryOptions = computed(() => {

        const options = [
            {label: '--Seleccione--', value: '', attrs: {disabled: true}},
            ...category.map( category => (
                {label: category.name, value:category.id}
            ))
        ]

        return options
    })

    const noResults = computed(() => productsCollection.value.length === 0)

    //filtrar producto
    const filteredProducto = computed(()=> {
        return productsCollection.value
        .filter( product => product.category === selectedCategory.value)
        .filter( product => product.availability > 0)
    })

    return {
        createProduct,
        updateProduct,
        deleteProduct,
        productsCollection,
        category,
        selectedCategory,
        categoryOptions,
        noResults,
        filteredProducto
        
        

    }
})