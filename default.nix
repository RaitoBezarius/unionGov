{ pkgs ? import <nixpkgs> {} }:
let
  sources = import ./ops/nix/sources.nix;
  npmlock2nix = pkgs.callPackage sources.npmlock2nix {};
in
{
  frontend = {
    nextDir = { env ? {} }: npmlock2nix.build ({
      src = ./frontend;
      installPhase = "cp -r .next $out";
      buildCommands = [ "npm run build" ];
    } // env);

    nodeModules = npmlock2nix.node_modules {
      src = ./frontend;
    };
  };

  shell = pkgs.mkShell {
    SECRET_KEY = "gXizOjVKrh-gQAo345jObYyRNpb-4bbG5jZqaijf_J0";
    buildInputs = [
      pkgs.raito-dev.myNixops
      pkgs.yarn2nix
      pkgs.poetry
      pkgs.nodejs
      pkgs.yarn
      (pkgs.poetry2nix.mkPoetryEnv {
        projectDir = ./.;
      })
    ];
  };

  backend = rec {
    package = (pkgs.poetry2nix.mkPoetryApplication {
      projectDir = ./.;
    }).dependencyEnv;

    static = pkgs.stdenv.mkDerivation {
      pname = "uniongov-backend-static";
      version = "1.0.0";
      phases = [ "buildPhase" ];

      SECRET_KEY = "fake";
      DJANGO_SETTINGS_MODULE = "unionGov.settings";
      STATIC_ROOT = "$out";

      buildPhase = ''
        ${package}/bin/django-admin collectstatic --no-input
      '';
    };
  };
}
