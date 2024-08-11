import { storage } from "./firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const upload = async (file) => {

    const response = await fetch(file);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {


        const date = new Date()
        const storageRef = ref(storage, `images/${date+file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, blob);
        uploadTask.on('state_changed', 
            (snapshot) => {
        
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
                console.log(error.message)
            }, 
            () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL)
            });
            }
        );
    })
}

export default upload
