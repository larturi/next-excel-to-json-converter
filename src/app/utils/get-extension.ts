export function getExtension(url: string) {
    const fileName = url.split('/').pop(); 
    const last4Letters = fileName!.slice(-4); 
    return last4Letters;
}