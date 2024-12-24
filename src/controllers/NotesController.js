const knex = require("../database/knex");

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
    const { title, description, tags, links } = request.body;
    const user_id = request.user.id;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id,
    });

    const linksInsert = links.map((link) => {
      return {
        note_id,
        url: link,
      };
    });

    await knex("links").insert(linksInsert);

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        name,
        user_id,
      };
    });

    await knex("tags").insert(tagsInsert);

    // return the created note without querying the database again
    return response.status(201).json({
      id: note_id,
      title,
      description,
      tags,
      links,
    });
  }

  async show(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;

    const note = await knex("notes").where({ id, user_id }).first();

    if (!note) {
      return response.status(404).json({
        status: "error",
        message: "Note not found or unauthorized access"
      });
    }

    const tags = await knex("tags").where({ note_id: id }).orderBy("name");
    const links = await knex("links")
      .where({ note_id: id })
      .orderBy("created_at");

    return response.json({
      ...note,
      tags,
      links,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    const note = await knex("notes").where({ id });

    if (note.length > 0) {
      await knex("notes").where({ id }).delete();
    } else {
      return response.status(400).json({ error: "User doesn't have notes." });
    }

    return response.json();
  }
}

module.exports = NotesController;
