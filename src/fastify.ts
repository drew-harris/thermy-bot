import Fastify from "fastify";
import { db } from "./db";
import z from "zod";
import { scripts } from "./db/schema";
import { respond } from "./ai";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.get("/scripts", async (req, res) => {
  try {
    const scripts = await db.query.scripts.findMany().execute();
    return scripts;
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error });
  }
});

const newScriptSchema = z.object({
  name: z.string().nonempty(),
  script: z.string().nonempty(),
});

fastify.post("/upload", async (req, res) => {
  try {
    const { name, script } = newScriptSchema.parse(req.body);
    // Set all scripts to inactive
    await db.update(scripts).set({ isActive: false }).execute();

    await db.insert(scripts).values({
      name,
      script,
      isActive: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      req.log.error(error);
      res.status(500).send({ error: "Something went wrong" });
    }
  }
});

const getResponseSchema = z.object({
  prompt: z.string(),
});

fastify.post("/respond", async (req, res) => {
  try {
    const { prompt } = getResponseSchema.parse(req.body);
    console.log("sending request from route");
    const response = await respond(prompt);
    return { response };
  } catch (error) {}
});

const startServer = () => {
  fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    // Server is now listening on ${address}
  });
};

export { startServer };
