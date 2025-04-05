import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {Address} from "@prisma/client";
import {AddressesService} from "./address.service";
import {AuthGuard} from "@nestjs/passport";

@UseGuards(AuthGuard('jwt'))
@Controller('/api/addresses')
export class AddressesController {

    constructor(private readonly addressesService: AddressesService) {
    }

    @Get('')
    getAddresses(@Query() {userId}: { userId?: Address['userId'] }) {
        return this.addressesService.getAll(userId);
    }

    @Post('')
    addAddress(@Body() {id, ...body}: Address): any {
        return this.addressesService.create(body);
    }

    @Put('/:id')
    editAddress(@Param('id') id: number, @Body() body: any): any {
        return this.addressesService.update(body);
    }

    @Delete('/:id')
    deleteAddress(@Param('id') id: number): any {
        return this.addressesService.delete(Number(id));
    }
}
