import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(AuthGuard('jwt'))
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get() get(@CurrentUser() user: any) { return this.wishlistService.get(user._id); }

  @Post(':productId')
  toggle(@CurrentUser() user: any, @Param('productId') productId: string) {
    return this.wishlistService.toggle(user._id, productId);
  }

  @Delete(':productId')
  remove(@CurrentUser() user: any, @Param('productId') productId: string) {
    return this.wishlistService.remove(user._id, productId);
  }
}
