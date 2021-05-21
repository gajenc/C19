class CustomError extends Error {
    code: number;
}

class InvalidDestination extends CustomError {}

export {
    InvalidDestination
}