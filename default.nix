{ pkgs ? import <nixpkgs> {} }:
{
  shell = pkgs.mkShell {
    SECRET_KEY = "gXizOjVKrh-gQAo345jObYyRNpb-4bbG5jZqaijf_J0";
    buildInputs = [
      pkgs.poetry
      pkgs.nodejs
      pkgs.yarn
      (pkgs.poetry2nix.mkPoetryEnv {
        projectDir = ./.;
      })
    ];
  };

  app = (pkgs.poetry2nix.mkPoetryApplication {
    projectDir = ./.;
  }).dependencyEnv;
}
