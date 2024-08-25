import { storage } from "./firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const upload = async (file) => {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error('Failed to fetch the file.');
        }

        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const date = new Date();
            const storageRef = ref(storage, `images/${date + file.name}`);

            const uploadTask = uploadBytesResumable(storageRef, blob);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error('Upload failed:', error.message);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => resolve(downloadURL))
                        .catch((error) => {
                            console.error('Failed to get download URL:', error);
                            reject(error);
                        });
                }
            );
        });
    } catch (error) {
        console.error('File upload encountered an error:', error);
        throw error; // Ensure that the calling code knows the error occurred
    }
};

export default upload;

