import {Controller, Get} from '@nestjs/common';
import {ServicesService} from "./services.service";

@Controller('/api/services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {

    }

    @Get('/')
    getAddresses() {
        return this.servicesService.getAll();
    }

    // @Post('/')
    // addAddress(@Body() {id, ...body}: Service): any {
    //     return this.servicesService.create(body);
    // }
    //
    // @Put('/:id')
    // editAddress(@Param('id') id: number, @Body() body: any): any {
    //     return this.servicesService.update(body);
    // }
    //
    // @Delete('/:id')
    // deleteAddress(@Param('id') id: number): any {
    //     return this.servicesService.delete(Number(id));
    // }
}
