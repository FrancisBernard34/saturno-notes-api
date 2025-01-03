const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class NotesController {
  async index(request, response) {
    const { title, tags } = request.query;
    const user_id = request.user.id;

    let notes;

    if (tags) {
      const filterTags = tags.split(",");

      notes = await knex("tags")
        .select(["notes.id", "notes.title", "notes.user_id"])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "tags.note_id", "notes.id")
        .groupBy("notes.id")
        .orderBy("notes.title");
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });
    const notesWithTags = notes.map((note) => {
      const tags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags
      }
    });

    return response.json(notesWithTags);
  }

  async create(request, response) {
    try {
      const { title, description, tags = [], links = [] } = request.body;
      const user_id = request.user.id;

      if (!title) {
        throw new AppError("O título é obrigatório", 400);
      }

      // First insert the note
      const [insertedNote] = await knex("notes")
        .insert({
          title,
          description,
          user_id,
        })
        .returning('*');

      const note_id = insertedNote.id;

      // Insert links if any
      if (links.length > 0) {
        const linksInsert = links.map((link) => {
          return {
            note_id,
            url: link,
          };
        });

        await knex("links").insert(linksInsert);
      }

      // Insert tags if any
      if (tags.length > 0) {
        const tagsInsert = tags.map((name) => {
          return {
            note_id,
            name,
            user_id,
          };
        });

        await knex("tags").insert(tagsInsert);
      }

      return response.status(201).json({
        id: note_id,
        title,
        description,
        tags,
        links,
      });
    } catch (error) {
      console.error("Error creating note:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Erro ao criar a nota", 500);
    }
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");
    const links = await knex("links").where({ note_id: id }).orderBy("created_at");

    return response.json({
      ...note,
      tags,
      links
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete();

    return response.json();
  }
}

module.exports = NotesController;
