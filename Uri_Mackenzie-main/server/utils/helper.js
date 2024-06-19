exports.convertToArray = (data) => {
    if (!Array.isArray(data)) {
        data = [data]; // Convert to an array if it's a single image
    }
    return data;
}
exports.getPublicId = (data) => {
    var regex = /[!@#$%^&*(),.?":{}|<>]/g;
    // Replace special characters with an empty string
    let updatedData = data.replace(regex, '');
    return updatedData.replace(/ /g, '_');
}
exports.checkCategory = (data) => {
    const allCategory = ['Plants', 'Seeds', 'Pots', 'Care'];
    return allCategory.includes(data);
}
exports.daysDiff = (data) => {
    const currentDate = new Date();
    const deliveryDate = new Date(data);
    const timeDiff = deliveryDate.getTime() - currentDate.getTime();
    const daysDifference = Math.floor(timeDiff / (1000 * 3600 * 24));

    return daysDifference;
}