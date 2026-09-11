"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
export function useSettlements(){return useQuery({queryKey:["settlements"],queryFn:()=>api.get<{data:unknown[]}>("/settlements")})}