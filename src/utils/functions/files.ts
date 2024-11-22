export const downloadZipFile = (res: any, fileName: string) => {
    // In a typical scenario, if the server responds with a file, you might create a Blob and initiate a download.
    const blob = new Blob([res.data], {type: 'application/zip'});
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};