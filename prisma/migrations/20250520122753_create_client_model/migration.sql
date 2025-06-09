-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "id_pessoa" INTEGER NOT NULL,
    "idVendedor" INTEGER,
    "limiteCredito" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "observacao" TEXT,
    "score" INTEGER,
    "ultima_compra" TIMESTAMP(3),
    "vr_ultima_compra" DECIMAL(15,2),
    "negativado" BOOLEAN NOT NULL DEFAULT false,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);
