import { Router } from "express";
import { db, customersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.post("/customers/sync", async (req, res) => {
  const { firebase_uid, name, email, phone, photo_url, provider } = req.body;

  if (!firebase_uid || !name || !email) {
    res.status(400).json({ success: false, error: "firebase_uid, name e email são obrigatórios" });
    return;
  }

  try {
    const existing = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.firebase_uid, firebase_uid))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(customersTable)
        .set({
          name,
          email,
          phone: phone ?? existing[0].phone,
          photo_url: photo_url ?? existing[0].photo_url,
          provider: provider ?? existing[0].provider,
          updated_at: new Date(),
        })
        .where(eq(customersTable.firebase_uid, firebase_uid))
        .returning();
      res.json({ success: true, data: updated, created: false });
      return;
    }

    const [created] = await db
      .insert(customersTable)
      .values({
        id: randomUUID(),
        firebase_uid,
        name,
        email,
        phone: phone ?? null,
        photo_url: photo_url ?? null,
        provider: provider ?? "email",
      })
      .returning();

    res.status(201).json({ success: true, data: created, created: true });
  } catch (err: any) {
    console.error("[customers/sync] erro:", err);
    res.status(500).json({ success: false, error: "Erro interno ao salvar cliente" });
  }
});

router.get("/customers/:firebase_uid", async (req, res) => {
  const { firebase_uid } = req.params;
  try {
    const [customer] = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.firebase_uid, firebase_uid))
      .limit(1);

    if (!customer) {
      res.status(404).json({ success: false, error: "Cliente não encontrado" });
      return;
    }
    res.json({ success: true, data: customer });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Erro interno" });
  }
});

export default router;
