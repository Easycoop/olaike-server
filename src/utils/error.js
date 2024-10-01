const HttpStatusCode = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    EXPIRED_AUTH: 407,
};

class CustomAPIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

class BadRequestError extends CustomAPIError {
    constructor(message) {
        super(message, HttpStatusCode.BAD_REQUEST);
    }
}

class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message, HttpStatusCode.UNAUTHORIZED);
    }
}

class ForbiddenError extends CustomAPIError {
    constructor(message) {
        super(message, HttpStatusCode.FORBIDDEN);
    }
}

class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message, HttpStatusCode.NOT_FOUND);
    }
}

class InternalServerError extends CustomAPIError {
    constructor(message) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
}

class ExpiredAuthError extends CustomAPIError {
    constructor(message) {
        super(message, HttpStatusCode.EXPIRED_AUTH);
    }
}

module.exports = {
    CustomAPIError,
    BadRequestError,
    UnauthenticatedError,
    ForbiddenError,
    NotFoundError,
    InternalServerError,
    ExpiredAuthError,
};
