/* ======================================================
   DELETE /api/configuration/:id
   DELETE USER CONFIGURATION (PERMANENT)
====================================================== */

import { Env} from "../../../types/env";
import { requireAuthUser
 } from "@domains/auth";
 import { json } from "@domains/auth/route/helper/https";

 import {

    configurationKey,
    userConfigurationsKey,
    getConfiguration,
 
  } from "..";


  export async function deleteUserConfiguration(

    request: Request,
    env: Env,
    id: string
  ) {
    // =========================
    // AUTH
    // =========================
    const session = await requireAuthUser(request, env);
    if (!session) {
      return json(
        { ok: false, error: "UNAUTHORIZED" },
        request,
        env,
        401
      );
    }
  
    // =========================
    // LOAD CONFIGURATION
    // =========================
    const configuration = await getConfiguration(env, id);
    if (!configuration) {
      return json(
        { ok: false, error: "NOT_FOUND" },
        request,
        env,
        404
      );
    }
  
    // =========================
    // OWNERSHIP CHECK
    // =========================
    if (configuration.userId !== session.user.id) {
      return json(
        { ok: false, error: "FORBIDDEN" },
        request,
        env,
        403
      );
    }
  
    // =========================
    // DELETE CONFIGURATION
    // =========================
    await env.CONFIGURATION_KV.delete(configurationKey(id));
  
    // =========================
    // UPDATE USER INDEX
    // =========================
    const listKey = userConfigurationsKey(session.user.id);
    const list: string[] =
      (await env.CONFIGURATION_KV.get(listKey, "json")) ?? [];
  
    const updatedList = list.filter(
      (configId) => configId !== id
    );
  
    await env.CONFIGURATION_KV.put(
      listKey,
      JSON.stringify(updatedList)
    );
  
    // =========================
    // RESPONSE
    // =========================
    return json(
      { ok: true },
      request,
      env
    );
  }
  