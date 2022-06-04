import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';

const SavePDF = async() =>{
    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
        return;
}
try {
    await StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'application/pdf')
    .then((r) => {
        console.log(r);
    })
    .catch((e) => {
        console.log(e);
    });
} catch(e) {
    console.log(e);
}};