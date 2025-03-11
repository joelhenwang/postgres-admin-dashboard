exports.allAccess = (req, res) => {
    res.status(200).send("Public content");
}

exports.webdevBoard = (res, res) => {
    res.status(200).send("WebDev Content");
}