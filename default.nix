{ pkgs ? import <nixpkgs> {} }:
let
  sources = import ./ops/nix/sources.nix;
  npmlock2nix = pkgs.callPackage sources.npmlock2nix {};
in
{
  frontend = {
    nextDir = npmlock2nix.build {
      src = ./frontend;
      installPhase = "cp -r .next $out";
      buildCommands = [ "npm run build" ];
    };

    nodeModules = npmlock2nix.node_modules {
      src = ./frontend;
    };
  };

  shell = pkgs.mkShell {
    SECRET_KEY = "gXizOjVKrh-gQAo345jObYyRNpb-4bbG5jZqaijf_J0";
    buildInputs = [
      pkgs.yarn2nix
      pkgs.poetry
      pkgs.nodejs
      pkgs.yarn
      (pkgs.poetry2nix.mkPoetryEnv {
        projectDir = ./.;
      })
    ];
  };

  backend = {
    package = (pkgs.poetry2nix.mkPoetryApplication {
      projectDir = ./.;
    }).dependencyEnv;
  };
}
