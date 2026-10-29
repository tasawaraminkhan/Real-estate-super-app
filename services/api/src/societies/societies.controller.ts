import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SocietiesService } from "./societies.service";

@ApiTags("societies")
@Controller({ path: "societies", version: "1" })
export class SocietiesController {
  constructor(private readonly societies: SocietiesService) {}

  @Get()
  list() {
    return this.societies.list();
  }

  @Get(":id/map")
  map(@Param("id") id: string) {
    return this.societies.getMap(id);
  }
}
