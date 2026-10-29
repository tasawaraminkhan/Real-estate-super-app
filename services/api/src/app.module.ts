import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { PropertiesModule } from "./properties/properties.module";
import { SearchModule } from "./search/search.module";
import { SocietiesModule } from "./societies/societies.module";
import { MediaModule } from "./media/media.module";
import { ConstructionModule } from "./construction/construction.module";
import { BillingModule } from "./billing/billing.module";
import { LeadsModule } from "./leads/leads.module";
import { ChatModule } from "./chat/chat.module";
import { FraudModule } from "./fraud/fraud.module";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PropertiesModule,
    SearchModule,
    SocietiesModule,
    MediaModule,
    ConstructionModule,
    BillingModule,
    LeadsModule,
    ChatModule,
    FraudModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
