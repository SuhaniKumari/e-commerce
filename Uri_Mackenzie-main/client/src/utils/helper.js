export function convertDateFormat(dateString) {
    // Parse the date string
    const date = new Date(dateString);

    // Extract the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const am_pm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Construct the standard date format
    const standardDateFormat = `${year}-${month}-${day} ${hours}:${minutes} ${am_pm}`;

    return standardDateFormat;
}

export function convertDate(dateString) {
    // Parse the date string
    const date = new Date(dateString);

    // Extract the date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Construct the standard date format
    const standardDateFormat = `${day}-${month}-${year}`;

    return standardDateFormat;
}

export function generateDeepCopy(obj) {
    // Handle null or non-object types
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // Create an empty object or array to store the copy
    const copy = Array.isArray(obj) ? [] : {};

    // Iterate over all keys in the original object or array
    for (let key in obj) {
        // Check if the key is a direct property of the object (not inherited)
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // Recursively copy nested objects or arrays
            copy[key] = generateDeepCopy(obj[key]);
        }
    }

    return copy;
}

export function orderNextStep(currentStatus, orderType) {
    const validStatusTransitions = {
        Order: {
            Pending: 'Processing',
            Processing: 'Shipped',
            Shipped: 'On_the_way',
            On_the_way: 'Delivered'
        },
        Replacement: {
            Pending: 'Processing',
            Processing: 'Shipped',
            Shipped: 'On_the_way',
            On_the_way: 'Delivered'
        },
        Return: {
            Pending: 'Processing',
            Processing: 'On_the_way',
            On_the_way: 'Pickup',
            Pickup: 'Returned'
        },
    };

    return validStatusTransitions[orderType][currentStatus];
}