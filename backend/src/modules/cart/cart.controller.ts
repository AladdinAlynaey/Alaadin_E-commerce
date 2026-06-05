import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get() getCart(@CurrentUser() user: any) { return this.cartService.getCart(user._id); }

  @Post('items')
  addItem(@CurrentUser() user: any, @Body() body: any) { return this.cartService.addItem(user._id, body); }

  @Put('items/:index')
  updateQuantity(@CurrentUser() user: any, @Param('index') index: number, @Body('quantity') quantity: number) {
    return this.cartService.updateQuantity(user._id, index, quantity);
  }

  @Delete('items/:index')
  removeItem(@CurrentUser() user: any, @Param('index') index: number) { return this.cartService.removeItem(user._id, index); }

  @Post('items/:index/save-for-later')
  saveForLater(@CurrentUser() user: any, @Param('index') index: number) { return this.cartService.saveForLater(user._id, index); }

  @Post('saved/:index/move-to-cart')
  moveToCart(@CurrentUser() user: any, @Param('index') index: number) { return this.cartService.moveToCart(user._id, index); }
}
