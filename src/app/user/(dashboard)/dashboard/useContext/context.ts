"use client";
import { createContext } from "react";

export const ParamContext = createContext<{ id: string } | undefined>(
  undefined,
);
