exports.allAccess = (req, res) => {
    res.status(200).send("Public content");
}

exports.webdevBoard = (req, res) => {
    res.status(200).send("WebDev Content");
}