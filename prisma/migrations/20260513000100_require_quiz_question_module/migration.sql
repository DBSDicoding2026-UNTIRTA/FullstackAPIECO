-- Keep existing quiz data while making the QuizQuestion -> QuizModule relation required.
DO $$
DECLARE
  fallback_module_id TEXT;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'QuizQuestion'
      AND column_name = 'moduleId'
  ) THEN
    IF EXISTS (SELECT 1 FROM "QuizQuestion" WHERE "moduleId" IS NULL) THEN
      SELECT "id"
        INTO fallback_module_id
      FROM "QuizModule"
      WHERE "title" = 'Modul Umum'
      LIMIT 1;

      IF fallback_module_id IS NULL THEN
        fallback_module_id := 'quizmodule_default';

        INSERT INTO "QuizModule" (
          "id",
          "title",
          "description",
          "order",
          "xpReward",
          "isActive",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          fallback_module_id,
          'Modul Umum',
          'Modul fallback untuk quiz lama yang belum memiliki module.',
          1,
          0,
          true,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
        ON CONFLICT ("id") DO NOTHING;
      END IF;

      UPDATE "QuizQuestion"
      SET "moduleId" = fallback_module_id
      WHERE "moduleId" IS NULL;
    END IF;
  END IF;
END $$;

ALTER TABLE "QuizQuestion" DROP CONSTRAINT IF EXISTS "QuizQuestion_moduleId_fkey";

ALTER TABLE "QuizQuestion" ALTER COLUMN "moduleId" SET NOT NULL;

ALTER TABLE "QuizQuestion"
  ADD CONSTRAINT "QuizQuestion_moduleId_fkey"
  FOREIGN KEY ("moduleId") REFERENCES "QuizModule"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
