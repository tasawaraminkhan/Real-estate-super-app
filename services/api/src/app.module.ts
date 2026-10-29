import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { PropertiesModule } from "./properties/properties.module";

@Module({
  imports: [PropertiesModule],
  controllers: [HealthController],
})
export class AppModule {}
