<script setup>
    import ShoppingCartItem from './ShoppingCartItem.vue';
    import Amount from './Amount.vue';
    import CouponForm from './CouponForm.vue';
    import { useCartStore } from '../stores/cart';
    import { useCouponStore } from '../stores/coupons';
    import { formatCurrency } from '../helpers';

    const cart = useCartStore()
    const coupon = useCouponStore()
</script>

<template>
 
    <p v-if="cart.isEmpty" class="text-xl text-gray-900">El Carrito esta vacio</p>
    <div v-else>
        <p class="text-4xl font-bold text-gray-900"> Resumen de Venta</p>
        <ul
            role="list"
            class="mt-6 divide-y divide-gray-200 border-gray-200"
        >
            <ShoppingCartItem 
                v-for="item in cart.items"
                :key="item.id"
                :item="item"
            />
        </ul>

        <dl class="space-y-6 border-t border-green-200 pt-6 text-sm font-medium text-gray-500">
            <Amount>
                <template #label>Subtotal:</template>
                {{ formatCurrency(cart.subtotal) }}
            </Amount>

            <Amount>
                <template #label>Impuesto:</template>
                {{ formatCurrency(cart.taxes) }}
            </Amount>

            <!-- <Amount>
                <template #label>Impuesto:</template>
                {{ formatCurrency(cart.taxes) }}
            </Amount> -->

            <Amount v-if="coupon.isValidCoupon">
                <template #label>Descuento:</template>
                {{ formatCurrency(coupon.discount) }}
            </Amount>


            <Amount>
                <template #label>Total a pagar:</template>
                {{ formatCurrency(cart.total) }}
            </Amount>
        </dl>

        <CouponForm />

        <button
            type="button"
            class="mt-10 w-full bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-bold p-3"
            @click="cart.checkout"
        >
            Confirmar Compra
        </button>
    </div>
</template>