rootProject.name = "poestack-sage"

include(
  "src:ts-ratchet",
  "src:ggg-api",
  "src:echo-common",
  "src:echo-app",
  "src:insights",
  "src:insights-cache-updater",
  "src:ggg-test-env",
  "src:sage-aws-cdk",
  "src:sage-docs",
  "src:sage-common",
  "src:tactics-image-gen",
  "src:eslint-config-sage"
)

File("src/echo-plugin-examples").listFiles()?.forEach {
  include("src:echo-plugin-examples:${it.name}")
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version("0.4.0")
}
