"use client";
import { useBarCodes } from "@/hooks/useBarCodes";
import { TrashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
export interface Codes {
  _id: string;
  name: string;
  ref: string;
}

export default function Home() {
  const { randomNumber, barcodeGenerator, barcodesToImage } = useBarCodes();
  const [form, setForm] = useState([{ key: "", value: "" }]);
  function handleDownloadCodes() {
    if (form.every((item) => item.key === "")) {
      alert(
        "Debe agregar al menos algun codigo para generar los codigos de barras"
      );
      return;
    }

    const dataUrls = form.map((code) => barcodeGenerator(code.value));
    const names = form.map((code) => code.key);

    barcodesToImage(dataUrls, `barcode multiple`, names);

    setForm([{ key: "", value: "" }]);
  }

  return (
    <div className="h-full w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDownloadCodes();
        }}
        className="h-full w-full max-w-4xl overflow-hidden flex flex-col mx-auto py-5"
      >
        <span className="w-full flex-1 overflow-y-auto space-y-3">
          <div className="grid grid-cols-6 gap-3">
            {form.map((item, idx) => (
              <>
                <div className="col-span-2 relative h-fit w-fit">
                  <input
                    value={item.key}
                    onChange={(e) => {
                      setForm((prev) => {
                        const currData = [...prev];
                        currData[idx] = {
                          ...currData[idx],
                          key: e.target.value,
                        };
                        return currData;
                      });
                    }}
                    id="key"
                    name="key"
                    placeholder="Nombre del producto"
                    type="text"
                    className=" !placeholder-gray-700 block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                  />
                </div>
                <div className="group w-8 right-3 z-20 h-full flex justify-center items-center">
                  <TrashIcon
                    onClick={() =>
                      setForm((prev) => {
                        const currData = [...prev];
                        currData.splice(idx, 1);
                        return currData;
                      })
                    }
                    className="h-5 w-5 cursor-pointer text-red-600"
                  />
                </div>
                <div className="col-span-3 relative h-fit w-fit">
                <input
                  value={item.value as string}
                  onChange={(e) =>
                    setForm((prev) => {
                      const currData = [...prev];
                      currData[idx] = {
                        ...currData[idx],
                        value: e.target.value,
                      };
                      return currData;
                    })
                  }
                  className=" !placeholder-gray-700 block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                  id="value"
                  name="value"
                  placeholder="Codigo"
                  type="text"
                />
                </div>
              </>
            ))}
            <button
              type="button"
              onClick={() => setForm([...form, { key: "", value: "" }])}
              className="!w-full !col-span-6 !py-1 bg-blue-600"
            >
              Añardir otro producto
            </button>
          </div>
        </span>
        <div className="w-full h-fit flex-[0,0,auto] grid grid-cols-6 gap-3">
          <button
            type="submit"
            className="!w-full !py-1 col-span-3 bg-green-600"
          >
            Descargar codigos de barras
          </button>
        </div>
      </form>
    </div>
  );
}
