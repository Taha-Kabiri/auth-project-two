const express = require("express");
const { Stream, Readable } = require("stream");

/*
 * ApiHelpers class.
 */
class ApiError {
  /**
   * create new api error
   * @param {String} msg - message
   */
  constructor(msg) {
    this.message = msg;
  }
}

class ApiHelpers {
  constructor() {}

  /**
   * it writes a file buffer to response and send
   * @param {express.Request} req - the express request object
   * @param {express.Response} res - the express response object
   * @param {Buffer | Stream} bufferOrStream - the file buffer
   * @param {String} filename - the filename
   * @param {String} mime - file mime type
   * @param {Number} statusCode - response http status code
   */
  WriteFile(req, res, bufferOrStream, filename, mime, statusCode) {
    if (res.headersSent) {
      return;
    }
    const scode = statusCode ?? 200;
    res.writeHead(scode, {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": mime,
    });
    if (bufferOrStream instanceof Buffer) {
      res.end(buffer);
    } else {
      bufferOrStream.pipe(res);
    }

    if (req.method.toLowerCase() == "options") {
      return; // idont remember why
    }
  }

  /**
   * it writes the body
   * @param {express.Response} res - the express response object
   * @param {Number} statusCode - the http response status code
   * @param {?Object} body - serializable body to write to response
   * @param {?Map<String, String>} headers - the response headers
   */
  WriteResponse(res, statusCode = 200, body, headers) {
    if (res.headersSent) {
      return;
    }

    if (statusCode == 500) {
      body =
        body ?? new ApiError("unhandled server error, please contact support");
    }
    if (!res.get("Content-Type") || !headers) {
      res.setHeader("Content-Type", "application/json");
    }
    if (headers) {
      for (const [key, value] of headers.entries()) {
        res.setHeader(key, value);
      }
    }
    if (!body) {
      res.status(statusCode).send({});
    } else {
      res.status(statusCode).json(body);
    }
  }

  /**
   * it writes response with status 200
   * @param {express.Response} res - the express response object
   * @param {Object} body - serializable object to write to response
   * @param {Map<String, String>} headers - headers to overwrite
   */
  ResponseOK(res, body, headers) {
    if (body === undefined) {
      body = {};
    }
    this.WriteResponse(res, 200, body, headers);
  }

  ResponseCreated(res, body) {
    this.WriteResponse(res, 201, body || new ApiError("Created"));
  }

  ResponseAccepted(res, body) {
    this.WriteResponse(res, 202, body || new ApiError("Accepted, Processing"));
  }

  ResponseNoContent(res) {
    this.WriteResponse(res, 204, {});
  }

  ResponseBadRequest(res, body) {
    this.WriteResponse(res, 400, body || new ApiError("Invalid Request"));
  }

  ResponseNotAuthenticated(res) {
    this.WriteResponse(res, 401, new ApiError("Unauthorized"));
  }

  ResponseForbidden(res, body) {
    this.WriteResponse(res, 403, body || new ApiError("You Can't Do This"));
  }

  ResponseNotFound(res, body) {
    this.WriteResponse(
      res,
      404,
      body || new ApiError("Related Data Not Found")
    );
  }

  ResponseConflict(res, body) {
    this.WriteResponse(res, 409, body || new ApiError("Record Exists"));
  }

  ResponseUnprocessableEntity(res) {
    this.WriteResponse(res, 422, new ApiError("Unprocessable Entity"));
  }

  ResponseLocked(res, body) {
    this.WriteResponse(res, 423, body || new ApiError("Resource is Locked"));
  }

  ResponseTooManyRequest(res, body) {
    this.WriteResponse(res, 429, body || new ApiError("Too Many Request"));
  }

  ResponseServerError(res, body) {
    this.WriteResponse(
      res,
      500,
      body || new ApiError("Unhandled Server Error")
    );
  }

  ResponseServiceUnavailable(res, body) {
    this.WriteResponse(
      res,
      503,
      body || new ApiError("Service Temporary Down")
    );
  }
}

module.exports = {
  ApiHelpers: new ApiHelpers(),
  ApiError,
};
