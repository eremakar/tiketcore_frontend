export default function useEnv() {
    return {
        api: {
            // url: process.env.NEXT_PUBLIC_API_URL
            url: 'http://185.47.167.38:20088'
        },
        s3: {
            // url: process.env.NEXT_PUBLIC_S3_API_URL
            url: 'http://185.47.167.26/s3'
        }
    }
}
