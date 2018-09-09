function getVolume50(openHighLowCloseVolumeData) {
    let i = 0;
    let volume50 = 0

    for (key in openHighLowCloseVolumeData) {
        i++;

        if (i < 50) {
            volume50 += parseInt(openHighLowCloseVolumeData[key]['5. volume']);
        } else {
            volume50 = volume50 / 50;
            break;
        }
    }

    return volume50;
}

module.exports = getVolume50;