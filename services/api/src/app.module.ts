import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { PropertiesModule } from "./properties/properties.module";
import { SearchModule } from "./search/search.module";
import { SocietiesModule } from "./societies/societies.module";

@Module({
  imports: [PrismaModule, AuthModule, PropertiesModule, SearchModule, SocietiesModule],
  controllers: [HealthController],
})
export class AppModule {}
