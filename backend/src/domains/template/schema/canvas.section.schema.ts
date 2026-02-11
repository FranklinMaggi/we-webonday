import z from "zod";    
import { NavbarSectionSchema } from "./navbar.section.schema";
import { HeroSectionSchema } from "./hero.section.schema";
import { CentralModuleSectionSchema } from "./central.module.section.schema";

export const CanvasSectionSchema = z.discriminatedUnion("type", [
    NavbarSectionSchema,
    HeroSectionSchema,
CentralModuleSectionSchema
    // gallery, opening-hours, map, footer (poi)
  ]);
  