import {Controller, Get, UseInterceptors} from '@nestjs/common';
import {ServicesService} from "./services.service";
import {CacheInterceptor, CacheKey, CacheTTL} from "@nestjs/cache-manager";

@Controller('/api/services')
@UseInterceptors(CacheInterceptor) // Добавляем интерсептор
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {

    }

    @Get('/')
    @CacheKey('SERVICES')
    @CacheTTL(3600 * 24)
    getAll() {
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
