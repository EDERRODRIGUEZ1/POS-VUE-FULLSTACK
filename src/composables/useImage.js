import { ref, computed } from 'vue'
import { uid } from 'uid';
import { useFirebaseStorage } from 'vuefire';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function useImage() {
    const url = ref('')
    const storage = useFirebaseStorage()
        
    const onFileChanse = e => {
        const file = e.target.files[0]
        const filename = uid() + '.jpg'

        //ubicacion donde se guardaran las imagenes
        const sRef = storageRef(storage, '/products/' + filename)

        //Sube el archivo
        const uploadTask = uploadBytesResumable(sRef, file);
        uploadTask.on('state_changed', 
            () => {},
            (error) => console.log(error),
            () => {
                //Si estamos el tercer call back significa que la imagen se subio
                //Upload is complete
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadUrl) => {
                        url.value = downloadUrl
                    })
            }
        )
    }

    const isImageUploaded = computed(() => {
        return url.value ? url.value : null
    })
    
    return {
        url,
        onFileChanse,
        isImageUploaded

        
    }
}
