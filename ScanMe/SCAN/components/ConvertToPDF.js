import RNImageToPdf from 'react-native-image-to-pdf';

const myAsyncPDFFunction = async () => {
    try {
        const options = {
            imagePaths: ['/path/to/image1.png','/path/to/image2.png'],
            name: 'PDFName',
            maxSize: { // optional maximum image dimension - larger images will be resized
                width: 900,
                height: Math.round(deviceHeight() / deviceWidth() * 900),
            },
            quality: .7, // optional compression paramter
        };
        const pdf = await RNImageToPdf.createPDFbyImages(options);
        
        console.log(pdf.filePath);
    } catch(e) {
        console.log(e);
    }
}