import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import axios from 'axios';
import { CancelShipmentDto } from './dto/cancel-shipments.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Order) private orderRespository: Repository<Order>,
  ) {}
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
    // const coordinates = await this.getCoordinates(
    //   country.code,
    //   createShipmentDto.user.postalCode,
    // );
    const data = JSON.stringify({
      origin: {
        name: 'Lachoco Latera',
        company: 'Tiempo de Chocolatear SL',
        email: 'ventas@lachoco-latera.com',
        phone: '+34634089473',
        street: `${createShipmentDto.country === 'CO' ? 'carretera 4a' : 'Calle lepanto'}`,
        number: `${createShipmentDto.country === 'CO' ? '12' : '18'}`,
        district: 'other',
        city: `${createShipmentDto.country === 'CO' ? '11001000' : 'Castilla y León'}`,
        state: `${createShipmentDto.country === 'CO' ? 'DC' : 'SG'}`,
        country: `${createShipmentDto.country === 'CO' ? 'CO' : 'ES'}`,
        postalCode: `${createShipmentDto.country === 'CO' ? '110311' : '40196'}`,
        reference: '',
        // coordinates: {
        //   latitude: `${createShipmentDto.country === 'CO' ? '4.601612' : '40.968668'}`,
        //   longitude: `${createShipmentDto.country === 'CO' ? '-74.026441' : '-4.102751'}`,
        // },
      },
      destination: {
        name: createShipmentDto.user.name,
        company: '',
        email: createShipmentDto.user.email,
        phone: '1138516604',
        street: createShipmentDto.user.street,
        number: createShipmentDto.user.number,
        district: 'other',
        city: "05001000",
        state: "AN",
        country: "CO",
        postalCode: "050031",
        reference: '',
        // coordinates: {
        //   latitude: coordinates.coordinates.latitute,
        //   longitude: coordinates.coordinates.longitude,
        // },
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
            length: 10,
            width: 10,
            height: 10,
          },
        },
      ],
      shipment: {
        carrier: createShipmentDto.carrier,
        type: 0,
      },
      settings: {
        currency: `${createShipmentDto.country === 'CO' ? 'COP' : 'EUR'}`,
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
    const user = await this.userRepository.findOne({
      where: { email: createShipmentDto.user.email },
    });
    if (!user) throw new NotFoundException('User not found');

    const country = await this.getcountry(createShipmentDto.user.country);
    const state = await this.getStateBytCountry(
      country.code,
      createShipmentDto.user.state,
    );

    const data = JSON.stringify({
      origin: {
        name: 'Lachoco Latera',
        company: 'Tiempo de Chocolatear SL',
        email: 'ventas@lachoco-latera.com',
        phone: '+34634089473',
        street: `${createShipmentDto.country === 'CO' ? 'carretera 4a' : 'Calle lepanto'}`,
        number: `${createShipmentDto.country === 'CO' ? '12' : '18'}`,
        district: 'other',
        city: `${createShipmentDto.country === 'CO' ? 'cundinamarca' : 'Castilla y León'}`,
        state: `${createShipmentDto.country === 'CO' ? 'dc' : 'SG'}`,
        country: `${createShipmentDto.country === 'CO' ? 'co' : 'ES'}`,
        postalCode: `${createShipmentDto.country === 'CO' ? '110311' : '40196'}`,
        reference: '',
      },
      destination: {
        name: createShipmentDto.user.name,
        company: '',
        email: createShipmentDto.user.email,
        phone: createShipmentDto.user.phone,
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
        carrier: createShipmentDto.carrier,
        service: createShipmentDto.carrierService,
        type: 1,
      },
      settings: {
        printFormat: 'PDF',
        printSize: 'STOCK_4X6',
        comments: 'comentarios de el envío',
        currency: `${createShipmentDto.country === 'CO' ? 'COP' : 'EUR'}`,
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

    // const userAddress = new Address();
    // userAddress.city = createShipmentDto.user.city;
    // userAddress.street = createShipmentDto.user.street;
    // userAddress.number = createShipmentDto.user.number;
    // userAddress.state = createShipmentDto.user.state;
    // userAddress.country = createShipmentDto.user.country;
    // userAddress.postalCode = createShipmentDto.user.postalCode;
    // userAddress.phone = createShipmentDto.user.phone;
    // userAddress.carrier = createShipmentDto.carrier;
    // userAddress.carrierService = createShipmentDto.carrierService;
    // userAddress.carrierCountry = createShipmentDto.country;
    // userAddress.user = user;

    // await this.addressRespository.save(userAddress);

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
