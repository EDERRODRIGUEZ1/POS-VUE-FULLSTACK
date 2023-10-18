import { computed } from "vue";
import { defineStore } from "pinia";
import { useFirestore, useCollection } from 'vuefire'; //permite que mi app de vue se conecte con firestore
import { collection, addDoc, where, query, limit, orderBy, updateDoc } from 'firebase/firestore';

export const useProductsStore = defineStore('products', ()=> {

    const db = useFirestore();


    const category = [
        {id: 1, name: 'Sudaderas'},
        {id: 2, name: 'Tenis'},
        {id: 3, name: 'Lentes'},
    ]

    const q = query(
        collection(db, 'products'),
        where('availability', 'asc')
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
        console.log(id);
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

    return {
        createProduct,
        updateProduct,
        productsCollection,
        categoryOptions,
        noResults,
        deleteProduct
        

    }
})