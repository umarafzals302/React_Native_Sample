import { Platform, CameraRoll } from "react-native";
import RNFS from 'react-native-fs';

const DIRECTORY = RNFS.CachesDirectoryPath;
import { store } from '../store'
const { authToken } = store.getState().userSession

const imageTypes = {
    PNG: "PNG",
    JPEG: "JPEG",
    JPG: "JPG",
    GIF: "GIF",
}

const download = async (uri, isActualDownload, callback = null, onBegin = null, onChangeProgress = null) => {
    try {
        const fileData = uri.split('/').pop().split('.')
        const fileName = fileData[0]
        const fileExtention = fileData.pop();
        const isImage = imageTypes[fileExtention.toUpperCase()] !== undefined

        let directory = `${DIRECTORY}/edac`
        if (isActualDownload) {
            // if (isImage) directory = RNFS.PicturesDirectoryPath
            // else
            directory = Platform.OS == 'ios' ? RNFS.DocumentDirectoryPath : RNFS.ExternalDirectoryPath
            if (Platform.OS == 'android') await RNFS.mkdir(`${directory}/edac/`)
        } else {
            await RNFS.mkdir(directory)
        }



        let destPath = `${directory}/${fileName}.${fileExtention}`

        console.log('DownloadManager-download', 'directory', directory)
        console.log('DownloadManager-download', 'destPath', destPath)

        downloadFile(uri, isImage, destPath, callback, onBegin, onChangeProgress)
    } catch (error) {
        console.log('DownloadManager-download', 'error', error)
    }
}

const downloadFile = async (uri, isImage, destination, callback, onBegin, onChangeProgress) => {

    try {
        const stats = await RNFS.stat(destination)
        console.log('DownloadManager-downloadFile', 'RNFS.stat', 'then', stats)

        if (stats.isFile()) {
            onSuccess(destination, callback)
            return
        }
    } catch (err) {
        console.log('DownloadManager-downloadFile', 'RNFS.stat', 'catch', err)
    }

    const { jobId, promise } = RNFS.downloadFile({
        fromUrl: uri,
        toFile: destination,
        background: false,
        cacheable: false,
        connectionTimeout: 30 * 1000,
        readTimeout: 120 * 1000,
        begin: (response) => {
            console.log('DownloadManager-downloadFile', 'begin', response)
            if (onBegin && typeof onBegin == 'function') onBegin()
        },
        progress: (progress) => {
            console.log('DownloadManager-downloadFile', 'progress', progress)
            if (onChangeProgress && typeof onChangeProgress == 'function') onChangeProgress(progress)
        }
    });

    promise.then(async (response) => {
        console.log('DownloadManager-downloadFile', 'downloadFile.then', response.statusCode)
        onSuccess(destination, callback)
    }).catch((error) => {
        console.log('DownloadManager-downloadFile', 'downloadFile.catch', error)
    })
}

const onSuccess = async (destination, callback) => {
    if (typeof callback == 'function') {
        callback({ path: destination })
    }
}

export default {
    download
}