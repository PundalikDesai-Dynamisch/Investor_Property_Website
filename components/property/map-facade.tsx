"use client";
import { useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui";

/** Shows coordinates and loads Google Maps only on request. */
export function MapFacade({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const [on, setOn] = useState(false);
  const ns = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}  ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
  return (
    <div className="overflow-hidden rounded-md border border-line bg-card">
      {on ? (
        <iframe title={`Map of ${name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="aspect-[16/9] w-full" src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`} />
      ) : (
        <div className="relative grid aspect-[16/9] place-items-center bg-tint [background-image:linear-gradient(var(--color-line-2)_1px,transparent_1px),linear-gradient(90deg,var(--color-line-2)_1px,transparent_1px)] [background-size:36px_36px]">
          <div className="text-center">
            <MapPin className="mx-auto size-7 text-brand" aria-hidden />
            <p className="tnum label mt-2 !text-ink-2">{ns}</p>
            <Button className="mt-4" variant="primary" onClick={() => setOn(true)}>Load interactive map</Button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm">
        <span className="text-muted">Map pin as published for {name}</span>
        <a className="flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline" href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noopener">Open in Google Maps <ExternalLink className="size-3.5" aria-hidden /></a>
      </div>
    </div>
  );
}
