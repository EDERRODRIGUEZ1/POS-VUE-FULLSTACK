<script setup>
    import { formatCurrency } from  '../helpers'
    defineProps({
        product: {
            type: Object
        }
    });
</script>

<template>
    <li class="flex items-center space border border-gray-200 p-6 bg-white shadow">
        <img 
            class="h-24 w-24"
            :src="product.image" 
            :alt="product.name"/>
        <div class="space-y-2">
            <h3 class="text-gray-900">{{ product.name }}</h3>
            <p class="font-extrabold">{{ formatCurrency(product.price) }}</p>
            <p class="">{{ product.availability }} En Existencia</p>
        </div>
    </li>
</template>