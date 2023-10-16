<script setup>
    import Link from '@/components/Link.vue';
    import useImage from '../../composables/useImage';

    const { url, onFileChanse, isImageUploaded } = useImage();
</script>

<template>
    <div class="">
        <Link 
            to="products"
        >Volver</Link>

        <h1 class="text-4xl font-black my-10">Nuevo Producto</h1>

        <div class="flex justify-center bg-white shadow">
            <div class="mt-10 p-10 w-full 2xl:w-2/4">
                <FormKit
                    type="form"
                    submit-label="Agregar Producto"
                    incomplete-message="No se pudo enviar, revisa los mensajes"
                   
                 >   
                    <FormKit
                        type="text"
                        label="Nombre"
                        name="name"
                        placeholder="Nombre de Producto"
                        validation="required"
                        :validation-messages="{required: 'El Nombre del Producto es Obligatorio'}"
                    />

                    <FormKit
                        type="file"
                        label="Imagen Producto"
                        name="image"
                        validation="required"
                        :validation-messages="{required: 'La Imagen del Producto es Obligatoria'}"
                        accept=".jpg"
                        @change="onFileChanse"
                    />

                    <div v-if="isImageUploaded">
                        <p class="font-black">Imagen Producto:</p>
                        <img
                            :src="url"
                            alt="nueva imagen producto"
                            class="w-32"
                        />
                    </div>

                    <FormKit
                        type="select"
                        label="Categoría"
                        name="category"
                        validation="required"
                        :validation-messages="{required: 'La Categoría es Obligatoria'}"
                        :options="[1,2,3]"
                        
                    />
                    <FormKit
                        type="number"
                        label="Precio"
                        placeholder="Precio de Producto"
                        name="price"
                        validation="required"
                        :validation-messages="{required: 'El Precio es Obligatorio'}"
                        min="1"
                    />

                    <FormKit
                        type="number"
                        label="Disponible"
                        placeholder="Cantidad disponible"
                        name="availability"
                        validation="required"
                        :validation-messages="{required: 'La cantidad es Obligatoria'}"
                        min="1"
                    />
                    
                </FormKit>
            </div>
        </div>
    </div>
</template>