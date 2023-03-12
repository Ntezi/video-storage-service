import morgan, {StreamOptions} from "morgan";
import {IncomingMessage} from 'http'
import Logger from "../utils/Logger";


interface Request extends IncomingMessage {
	body: {
		query: String;
	};
}

const stream: StreamOptions = {
	write: (message: string) => Logger.http(message.substring(0, message.lastIndexOf("\n"))),
};

const skip = () => {
	const env = process.env.NODE_ENV || "development";
	return env !== "development";
};

const registerGraphQLToken = () => {
	morgan.token("graphql-query", (req: Request) => `GraphQL ${req.body.query}`);
};

registerGraphQLToken();

const LoggerMiddleware = morgan(
	":method :url :status :res[content-length] - :response-time ms\n:graphql-query",
	{ stream, skip }
);

export default LoggerMiddleware;
