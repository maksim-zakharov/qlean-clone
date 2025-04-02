import {Controller, Get, Param, Res} from '@nestjs/common';
import axios from "axios";

@Controller('')
export class SpaController {

    @Get('/')
    async getStatic(@Res() res) {
        const response = await axios.get(
            'https://maksim-zakharov.github.io/qlean-clone/',
            {
                responseType: 'stream',
            },
        );

        res.set('content-type', response.headers['content-type']);
        res.set('cache-control', response.headers['cache-control']);
        response.data.pipe(res);
    }

    // Нужно для локального фронта
    @Get('/qlean-clone/public/:path')
    async getPublic(@Param('path') path: string, @Res() res) {
        const response = await axios.get(
            `https://maksim-zakharov.github.io/qlean-clone/public/${path}`,
            {
                responseType: 'stream',
            },
        );
        res.set('content-type', response.headers['content-type']);
        res.set('cache-control', response.headers['cache-control']);
        response.data.pipe(res);
    }

    // Нужно для локального фронта
    @Get('/qlean-clone/assets/:path')
    async getCSS(@Param('path') path: string, @Res() res) {
        const response = await axios.get(
            `https://maksim-zakharov.github.io/qlean-clone/assets/${path}`,
            {
                responseType: 'stream',
            },
        );
        res.set('content-type', response.headers['content-type']);
        res.set('cache-control', response.headers['cache-control']);
        response.data.pipe(res);
    }

    // Обязательно должно быть в конце
    @Get('*')
    async getSPARouting(@Param('0') path: string, @Res() res) {
        // Фикс для SPA-роутинга
        if (!path || !path.includes('.')) {
            path = 'index.html';
        }

        const response = await axios.get(
            `https://maksim-zakharov.github.io/qlean-clone/${path}`,
            {
                responseType: 'stream',
            },
        );
        res.set('content-type', response.headers['content-type']);
        res.set('cache-control', response.headers['cache-control']);
        response.data.pipe(res);
    }
}
