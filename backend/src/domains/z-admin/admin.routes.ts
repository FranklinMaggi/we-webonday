        // ======================================================
        // BE || ADMIN — DOMAIN ROUTER
        // ======================================================
        //
        // RUOLO:
        // - Routing centralizzato di TUTTE le API Admin
        //
        // INCLUDE:
        // - configurations
        // - orders
        // - products
        // - options
        // - projects
        // - users
        // - kpi
        //
        // CONTRATTO:
        // - Ritorna Response se matcha
        // - Ritorna null se non è ADMIN
        //
        // NON DEVE:
        // - contenere logica di dominio
        // - accedere a KV direttamente
        // ======================================================

        import type { Env } from "../../types/env";
        import { withCors } from "@domains/auth";

        /* =========================
        CONFIGURATIONS
        ========================= */
        import {
        listAdminConfigurations,
        getAdminConfiguration,
        acceptConfiguration,
        rejectConfiguration,
        viewConfigurationDocuments,
        } from "./configurations";

        /* =========================
        ORDERS
        ========================= */
        import {
        listAdminOrders,
        getAdminOrder,
        } from "./orders/orders.admin";

        import {
        deleteOrder,
        transitionOrder,
        cloneDeletedOrder,
        } from "./orders/orders.actions";

        /* =========================
        PRODUCTS
        ========================= */
        import {
        listAdminProducts,
        getAdminProduct,
        } from "./products/products.admin";

        import { registerAdminProduct } from "./products/products.admin.register";
        import { updateProductOptions } from "./products/products.options.update";
        import { getAdminProductWithOptions } from "./products/products.withOptions";

        /* =========================
        OPTIONS
        ========================= */
        import {
        listAdminOptions,
        getAdminOption,
        updateOptionStatus,
        } from "./options/options.read";

        import { registerOption } from "./options/options.admin";

        /* =========================
        PROJECTS
        ========================= */
       
       
        /* =========================
        USERS
        ========================= */
        import { listAdminUsers } from "./users/user.read";

        /* =========================
        KPI
        ========================= */
        import { getAdminKPI } from "./kpi/kpi.read";
        import { requireAdmin } from "@domains/auth/route/admin/guard/admin.guard";
        /* ======================================================
        ROUTER
        ====================================================== */
        export async function handleAdminRoutes(
        request: Request,
        env: Env
        ): Promise<Response | null> {
        const { pathname } = new URL(request.url);
        const method = request.method;

        /* ======================================================
            DOMAIN CHECK
        ====================================================== */
        if (!pathname.startsWith("/api/admin")) {
            return null;
        }

        /* ======================================================
            ADMIN GUARD (HARD)
        ====================================================== */
        const denied = requireAdmin(request, env);
        if (denied) {
            return withCors(denied, request, env);
        }

        /* =========================
            CONFIGURATIONS
        ========================= */
        if (pathname === "/api/admin/configurations/list" && method === "GET") {
            return withCors(
            await listAdminConfigurations(request, env),
            request,
            env
            );
        }

        if (pathname === "/api/admin/configuration" && method === "GET") {
        return withCors(
            await getAdminConfiguration(request, env),
            request,
            env
        );
        }

        if (pathname === "/api/admin/configuration/accept" && method === "POST") {
        return withCors(
            await acceptConfiguration(request, env),
            request,
            env
        );
        }

        if (pathname === "/api/admin/configuration/reject" && method === "POST") {
        return withCors(
            await rejectConfiguration(request, env),
            request,
            env
        );
        }

        if (
        pathname === "/api/admin/configuration/view-documents" &&
        method === "GET"
        ) {
        return withCors(
            await viewConfigurationDocuments(request, env),
            request,
            env
        );
        }

        /* =========================
            ORDERS
        ========================= */

        if (pathname === "/api/admin/orders/list" && method === "GET") {
        return withCors(
            await listAdminOrders(request, env),
            request,
            env
        );
        }

        if (pathname === "/api/admin/order" && method === "GET") {
        return withCors(
            await getAdminOrder(request, env),
            request,
            env
        );
        }

        if (pathname === "/api/admin/order/delete" && method === "POST") {
        return withCors(
            await deleteOrder(request, env),
            request,
            env
        );
        }

        if (pathname === "/api/admin/order/transition" && method === "POST") {
        return withCors(
            await transitionOrder(request, env),
            request,
            env
        );
        }

        if (pathname === "/api/admin/order/clone" && method === "POST") {
        return withCors(
            await cloneDeletedOrder(request, env),
            request,
            env
        );
        }

        /* =========================
            PRODUCTS
        ========================= */

        if (pathname === "/api/admin/products/list" && method === "GET") {
        return withCors(
            await listAdminProducts(request, env),
            request,
            env
        );
        }

        if (pathname === "/api/admin/product" && method === "GET") {
        return withCors(
            await getAdminProduct(request, env),
            request,
            env
        );
        }

        if (pathname === "/api/products/register" && method === "PUT") {
        return withCors(
            new Response(
            JSON.stringify(
                await registerAdminProduct(request, env)
            )
            ),
            request,
            env
        );
        }

        if (
        pathname === "/api/admin/product/options/update" &&
        method === "POST"
        ) {
        return withCors(
            await updateProductOptions(request, env),
            request,
            env
        );
        }

        if (
        pathname === "/api/admin/product/with-options" &&
        method === "GET"
        ) {
        return withCors(
            await getAdminProductWithOptions(request, env),
            request,
            env
        );
        }

        /* =========================
            OPTIONS
        ========================= */

        if (pathname === "/api/admin/options/list" && method === "GET") {
        return withCors(
            await listAdminOptions(request, env),
            request,
            env
        );
        }

        if (pathname === "/api/admin/option" && method === "GET") {
        return withCors(
            await getAdminOption(request, env),
            request,
            env
        );
        }

        if (pathname === "/api/options/register" && method === "PUT") {
        return withCors(
            await registerOption(request, env),
            request,
            env
        );
        }

        if (
        pathname === "/api/admin/options/status" &&
        method === "POST"
        ) {
        return withCors(
            await updateOptionStatus(request, env),
            request,
            env
        );
        }

        /* =========================
            USERS
        ========================= */

        if (pathname === "/api/admin/users/list" && method === "GET") {
        return withCors(
            await listAdminUsers(request, env),
            request,
            env
        );
        }

        /* =========================
            KPI
        ========================= */

        if (pathname === "/api/admin/kpi" && method === "GET") {
        return withCors(
            await getAdminKPI(request, env),
            request,
            env
        );
        }

        return null;
        }