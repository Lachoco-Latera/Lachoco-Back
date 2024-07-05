import { Injectable } from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import axios from 'axios';
import { CancelShipmentDto } from './dto/cancel-shipments.dto';

@Injectable()
export class ShipmentsService {
  async carriesByCountry(country: string) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://queries-test.envia.com/service?country_code=${country}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ENVIOS_API_KEY}`,
      },
    };

    try {
      const response = await axios(config);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching country data:', error);
      throw error;
    }
  }

  async allCountries() {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://queries-test.envia.com/country`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ENVIOS_API_KEY}`,
      },
    };

    try {
      const response = await axios(config);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching country data:', error);
      throw error;
    }
  }

  async allStates(state) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://queries-test.envia.com/state?country_code=${state}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ENVIOS_API_KEY}`,
      },
    };

    try {
      const response = await axios(config);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching country data:', error);
      throw error;
    }
  }

  async getCoordinates(countryCode, zipCode) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://geocodes.envia.com/zipcode/${countryCode}/${zipCode}`,
      headers: {},
    };

    try {
      const response = await axios(config);
      return response.data[0];
    } catch (error) {
      console.error('Error fetching country data:', error);
      throw error;
    }
  }

  async getcountry(userCountry) {
    const countries = await this.allCountries();
    const country = countries.find(
      (c) => c.name.toLowerCase() === userCountry.toLowerCase(),
    );
    return country;
  }

  async getStateBytCountry(country, userState) {
    const states = await this.allStates(country);
    const state = states.find(
      (state) => state.name.toLowerCase() === userState.toLowerCase(),
    );
    return state;
  }

  async quoteShipments(createShipmentDto: CreateShipmentDto) {
    const country = await this.getcountry(createShipmentDto.user.country);
    const state = await this.getStateBytCountry(
      country.code,
      createShipmentDto.user.state,
    );
    const coordinates = await this.getCoordinates(country.code, 6600);

    const data = JSON.stringify({
      origin: {
        name: 'Christian Gordillo',
        company: 'chocolatera',
        email: 'carlos_molin@hotmail.com',
        phone: '8182000536',
        street: `${createShipmentDto.country === 'CO' ? 'calle 33' : "calle de l'Escorial"}`,
        number: `${createShipmentDto.country === 'CO' ? '626' : '173'}`,
        district: 'other',
        city: `${createShipmentDto.country === 'CO' ? 'mercedes' : 'gràcia'}`,
        state: `${createShipmentDto.country === 'CO' ? 'ba' : 'B'}`,
        country: `${createShipmentDto.country === 'CO' ? 'AR' : 'ES'}`,
        postalCode: `${createShipmentDto.country === 'CO' ? '6600' : '08024'}`,
        reference: '',
        coordinates: {
          latitude: `${createShipmentDto.country === 'CO' ? '-34.698311' : '41.384247'}`,
          longitude: `${createShipmentDto.country === 'CO' ? '-59.432132' : '2.176349'}`,
        },
      },
      destination: {
        name: createShipmentDto.user.name,
        company: '',
        email: createShipmentDto.user.email,
        phone: '1138516604',
        street: createShipmentDto.user.street,
        number: createShipmentDto.user.number,
        district: 'other',
        city: createShipmentDto.user.city,
        state: state.code_2_digits,
        country: country.code,
        postalCode: createShipmentDto.user.postalCode,
        reference: '',
        coordinates: {
          latitude: coordinates.coordinates.latitute,
          longitude: coordinates.coordinates.longitude,
        },
      },
      packages: [
        {
          content: 'chocolates',
          amount: 1,
          type: 'box',
          weight: 1,
          insurance: 0,
          declaredValue: 0,
          weightUnit: 'LB',
          lengthUnit: 'IN',
          dimensions: {
            length: 11,
            width: 15,
            height: 20,
          },
        },
      ],
      shipment: {
        carrier: `${createShipmentDto.country === 'CO' ? 'correoArgentino' : '41.384247'}`,
        type: 1,
      },
      settings: {
        currency: 'ARS',
      },
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api-test.envia.com/ship/rate/',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ENVIOS_API_KEY}`,
      },
      data: data,
    };

    return axios(config)
      .then(function (response) {
        return JSON.stringify(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async createlable(createShipmentDto: UpdateShipmentDto) {
    const country = await this.getcountry(createShipmentDto.user.country);
    const state = await this.getStateBytCountry(
      country.code,
      createShipmentDto.user.state,
    );

    const data = JSON.stringify({
      origin: {
        name: 'Christian Gordillo',
        company: 'chocolatera',
        email: 'carlos_molin@hotmail.com',
        phone: '8182000536',
        street: `${createShipmentDto.country === 'CO' ? 'calle 33' : "calle de l'Escorial"}`,
        number: `${createShipmentDto.country === 'CO' ? '626' : '173'}`,
        district: 'other',
        city: `${createShipmentDto.country === 'CO' ? 'mercedes' : 'gràcia'}`,
        state: `${createShipmentDto.country === 'CO' ? 'ba' : 'B'}`,
        country: `${createShipmentDto.country === 'CO' ? 'AR' : 'ES'}`,
        postalCode: `${createShipmentDto.country === 'CO' ? '6600' : '08024'}`,
        reference: '',
      },
      destination: {
        name: createShipmentDto.user.name,
        company: '',
        email: createShipmentDto.user.email,
        phone: '1138516604',
        street: createShipmentDto.user.street,
        number: createShipmentDto.user.number,
        district: 'other',
        city: createShipmentDto.user.city,
        state: state.code_2_digits,
        country: country.code,
        postalCode: createShipmentDto.user.postalCode,
        reference: '',
      },
      packages: [
        {
          content: 'Chocolates',
          amount: 1,
          type: 'box',
          dimensions: {
            length: 2,
            width: 5,
            height: 5,
          },
          weight: 1,
          insurance: 0,
          declaredValue: 400,
          weightUnit: 'KG',
          lengthUnit: 'CM',
        },
      ],
      shipment: {
        carrier: 'correoArgentino',
        service: createShipmentDto.carrierService,
        type: 1,
      },
      settings: {
        printFormat: 'PDF',
        printSize: 'STOCK_4X6',
        comments: 'comentarios de el envío',
        currency: 'ARS',
      },
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api-test.envia.com/ship/generate/',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ENVIOS_API_KEY}`,
      },
      data: data,
    };

    return axios(config)
      .then(function (response) {
        return JSON.stringify(response.data);
      })
      .catch(function (error) {
        return error;
      });
  }

  async cancelShipment(cancelShipment: CancelShipmentDto) {
    const data = JSON.stringify({
      carrier: cancelShipment.carrier,
      trackingNumber: cancelShipment.trackingNumber,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api-test.envia.com/ship/cancel/',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ENVIOS_API_KEY}`,
      },
      data: data,
    };

    return axios(config)
      .then(function (response) {
        return JSON.stringify(response.data);
      })
      .catch(function (error) {
        return error;
      });
  }

  async tracking(tracking) {
    const data = JSON.stringify({ trackingNumbers: [tracking] });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api-test.envia.com/ship/generaltrack/',
      headers: {
        Authorization: `Bearer ${process.env.ENVIOS_API_KEY}`,
      },
      data: data,
    };

    return axios(config)
      .then(function (response) {
        return JSON.stringify(response.data);
      })
      .catch(function (error) {
        return error;
      });
  }
}
