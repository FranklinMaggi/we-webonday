        // ======================================================
        // BE || POST /api/configuration/from-cart
        // ======================================================
        //
        // CREA CONFIGURATION COMPLETA DA CARRELLO
        //
        // SOURCE OF TRUTH:
        // - SolutionSchema
        // - ProductSchema
        // - OptionSchema
        // - Business (draft)
        //
        // ======================================================

        import { z } from "zod";
        import { Env } from "../../../types/env";
        import { SolutionSchema } from "../../../domains/solution/solution.schema";
        import { ProductSchema } from "../../../domains/product/product.schema";
        import { OptionSchema } from "../../../domains/option/option.schema.ts";
        import { ConfigurationSchema } from "../../../domains/configuration/configuration.schema";
        import { configurationKey,
            userConfigurationsKey, buildConfigurationId
        } from "../../../domains/configuration/configuration.schema";
        import { requireUser } from "../../../lib/auth/session";
        const InputSchema = z.object({
        businessName: z.string().min(2),
        solutionId: z.string().min(1),
        productId: z.string().min(1),
        optionIds: z.array(z.string()).default([]),
        });

        export async function createConfigurationFromCart(
        req: Request,
        env: Env,
        ) {

        /* =========================
        AUTH — REQUIRED
        ========================= */
        const auth = await requireUser(req, env);

        if (!auth) {
        return Response.json(
        { ok: false, error: "UNAUTHORIZED" },
        { status: 401 }
        );
        }

        const { userId } = auth;

        const body = InputSchema.parse(await req.json());

        /* =========================
            LOAD SOLUTION
        ========================= */
        const rawSolution = await env.SOLUTIONS_KV.get(
        `SOLUTION:${body.solutionId}`
        );
        if (!rawSolution) {
        return Response.json({ ok: false, error: "SOLUTION_NOT_FOUND" }, { status: 404 });
        }

        const solution = SolutionSchema.parse(JSON.parse(rawSolution));

        /* =========================
            LOAD PRODUCT
        ========================= */
        const rawProduct = await env.PRODUCTS_KV.get(
        `PRODUCT:${body.productId}`
        );
        if (!rawProduct) {
        return Response.json({ ok: false, error: "PRODUCT_NOT_FOUND" }, { status: 404 });
        }

        const product = ProductSchema.parse(JSON.parse(rawProduct));

        /* =========================
            LOAD OPTIONS (SNAPSHOT)
        ========================= */
        const options = [];

        for (const optId of body.optionIds) {
        const rawOpt = await env.OPTIONS_KV.get(`OPTION:${optId}`);
        if (!rawOpt) continue;
        options.push(OptionSchema.parse(JSON.parse(rawOpt)));
        }

        /* =========================
            BUILD CONFIGURATION ID
        ========================= */
        const configurationId = buildConfigurationId(
        body.businessName ?? "progetto",
        solution.id
        );

        const key = configurationKey(configurationId);

        /* =========================
            IDEMPOTENCY CHECK
        ========================= */
        const existing = await env.CONFIGURATION_KV.get(key);
        if (existing) {
        return Response.json({
            ok: true,
            configurationId,
            reused: true,
        });
        }

        /* =========================
            BUILD CONFIGURATION
        ========================= */
        const configuration = ConfigurationSchema.parse({
        solutionId: solution.id,
        productId: product.id,
        options: body.optionIds,

        data: {
            solution,
            product,
            options,

            business: {
            name: body.businessName,
            sector: solution.industries[0],
            city: "",
            email: "",
            },

            setup: {},
            ai: { status: "pending" },
        },

        status: "draft",
        });

        /* =========================
            PERSISTENCE
        ========================= */
        await env.CONFIGURATION_KV.put(
        key,
        JSON.stringify(configuration)
        );

        const userKey = userConfigurationsKey(userId);
        const list = JSON.parse(
        (await env.CONFIGURATION_KV.get(userKey)) ?? "[]"
        );

        if (!list.includes(configurationId)) {
        await env.CONFIGURATION_KV.put(
            userKey,
            JSON.stringify([...list, configurationId])
        );
        }

        /* =========================
            RESPONSE
        ========================= */
        return Response.json({
        ok: true,
        configurationId,
        reused: false,
        });
        }
