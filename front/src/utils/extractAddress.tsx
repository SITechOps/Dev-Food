import { IEndereco } from "../interface/IEndereco";

export const extractAddress = (
  place: google.maps.places.PlaceResult,
): IEndereco => {
  const address: IEndereco = {
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    pais: "",
    cep: "",
    plain: function () {
      return [
        this.logradouro,
        this.numero,
        this.bairro,
        this.cidade,
        this.estado,
        this.pais,
        this.cep,
      ]
        .filter(Boolean)
        .join(", ");
    },
  };

  if (!Array.isArray(place?.address_components)) {
    return address;
  }

  place.address_components.forEach((component: any) => {
    const types = component.types;
    const value = component.long_name;

    if (types.includes("route")) {
      address.logradouro = value;
    }

    if (types.includes("street_number")) {
      address.numero = value;
    }

    if (types.includes("sublocality_level_1")) {
      address.bairro = value;
    }

    if (types.includes("administrative_area_level_2")) {
      address.cidade = value;
    }

    if (types.includes("administrative_area_level_1")) {
      address.estado = value;
    }

    if (types.includes("country")) {
      address.pais = value;
    }

    if (types.includes("postal_code")) {
      address.cep = value;
    }
  });

  return address;
};
